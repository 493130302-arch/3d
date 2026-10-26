import bpy, os
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
mat=bpy.data.materials.new("Bronze"); mat.diffuse_color=(0.08,0.32,0.28,1); mat.metallic=.65; mat.roughness=.42
def cube(n,loc,scale):
 bpy.ops.mesh.primitive_cube_add(location=loc); o=bpy.context.object; o.name=n; o.scale=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); o.data.materials.append(mat)
cube('Face',(0,0,0),(0.65,.9,.17)); cube('Base',(0,-.98,0),(.85,.18,.22)); cube('Crown',(0,1.05,0),(.4,.22,.22)); cube('LeftSide',(-.72,-.35,0),(.16,.58,.21)); cube('RightSide',(.72,-.35,0),(.16,.58,.21))
for x in (-.34,.34):
 bpy.ops.mesh.primitive_torus_add(major_radius=.2,minor_radius=.055,major_segments=24,location=(x,.25,.22),rotation=(1.5708,0,0)); bpy.context.object.data.materials.append(mat)
for o in bpy.context.scene.objects: o.select_set(True)
for sc in bpy.data.scenes: sc.unit_settings.system='METRIC'
out=os.path.join(r'''D:\ai related\codex\2026-10-24\3d-3d-3d-1-3d-2\手机扫码看3D模型\assets''','bronze-mask.usdz')
bpy.ops.wm.usd_export(filepath=out, selected_objects_only=True, export_materials=True)
print('USDZ_OUT',out,os.path.getsize(out))
